#!/usr/bin/env python3
"""
prd_builder.py — Called by run-all-modules.sh
Reads a tasks/prd-module-N-*.md file and asks Claude to produce a prd.json.
If Claude is unavailable, falls back to a minimal single-story prd.json.

Usage:
  python3 prd_builder.py <md_file> <branch_name> <prd_output_path>
"""
import sys
import json
import re
import subprocess
import os

def fallback_prd(md_file, branch_name):
    """Minimal prd.json: one story per ### US-NNN block found in markdown."""
    with open(md_file) as f:
        text = f.read()

    title_match = re.search(r'^# (.+)', text, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else os.path.basename(md_file)

    description_match = re.search(r'## Introduction\n+(.+?)(?=\n#|\Z)', text, re.DOTALL)
    description = description_match.group(1).strip()[:200] if description_match else title

    # Extract each ### US-NNN block
    story_blocks = re.findall(
        r'### (US-\d+): (.+?)\n(.*?)(?=\n### US-|\Z)',
        text, re.DOTALL
    )

    stories = []
    for idx, (us_id, story_title, body) in enumerate(story_blocks, 1):
        # Extract acceptance criteria bullet lines
        ac_lines = re.findall(r'- \[[ x]\] (.+)', body)
        if not ac_lines:
            ac_lines = [
                "All acceptance criteria from the PRD are implemented",
                "npm run build succeeds",
                "Typecheck passes (npx tsc --noEmit)",
                "Lint passes (npm run lint)"
            ]
        # Extract description "As a ..." line
        desc_match = re.search(r'\*\*Description:\*\*\s*(.+?)(?=\n\n|\*\*)', body, re.DOTALL)
        story_desc = desc_match.group(1).strip() if desc_match else f"As a developer, implement {story_title}"

        stories.append({
            "id": us_id,
            "title": story_title.strip(),
            "description": story_desc,
            "acceptanceCriteria": ac_lines,
            "priority": idx,
            "passes": False,
            "notes": ""
        })

    if not stories:
        stories = [{
            "id": "US-001",
            "title": f"Implement {title}",
            "description": f"As a developer, implement all requirements in the PRD for {title}",
            "acceptanceCriteria": [
                "All acceptance criteria from the PRD are implemented",
                "npm run build succeeds",
                "Typecheck passes (npx tsc --noEmit)",
                "Lint passes (npm run lint)"
            ],
            "priority": 1,
            "passes": False,
            "notes": ""
        }]

    return {
        "project": "shunyuyao.github.io",
        "branchName": branch_name,
        "description": description,
        "userStories": stories
    }


def build_with_claude(md_file, branch_name):
    """Ask Claude to parse the markdown and produce structured prd.json."""
    with open(md_file) as f:
        md_content = f.read()

    prompt = f"""You are a PRD parser. Read the markdown PRD below and output ONLY a valid JSON object (no markdown fences, no explanation) matching this schema exactly:

{{
  "project": "shunyuyao.github.io",
  "branchName": "{branch_name}",
  "description": "<one-sentence module description>",
  "userStories": [
    {{
      "id": "US-001",
      "title": "<story title>",
      "description": "<As a ... I want ... so that ...>",
      "acceptanceCriteria": ["<criterion 1>", "<criterion 2>"],
      "priority": 1,
      "passes": false,
      "notes": ""
    }}
  ]
}}

Rules:
- branchName must be exactly: {branch_name}
- Extract ALL user stories from the "## User Stories" section (### US-NNN blocks)
- Each story acceptanceCriteria = the acceptance criteria bullet points (strip leading "- [ ] ")
- priority = the numeric order of the story (US-001 => 1, US-002 => 2, etc.)
- passes = false for all stories
- Output raw JSON only, no markdown code fences

PRD MARKDOWN:
{md_content}"""

    result = subprocess.run(
        ["claude", "--permission-mode", "bypassPermissions", "--print"],
        input=prompt,
        capture_output=True,
        text=True,
        timeout=120
    )
    output = result.stdout

    # Try to extract JSON from output
    match = re.search(r'\{.*\}', output, re.DOTALL)
    if match:
        try:
            obj = json.loads(match.group(0))
            # Ensure branchName is correct
            obj["branchName"] = branch_name
            return obj
        except json.JSONDecodeError:
            pass

    return None


def main():
    if len(sys.argv) != 4:
        print(f"Usage: {sys.argv[0]} <md_file> <branch_name> <prd_output_path>", file=sys.stderr)
        sys.exit(1)

    md_file, branch_name, output_path = sys.argv[1], sys.argv[2], sys.argv[3]

    print(f"  Building prd.json: {branch_name}")

    # Try Claude first
    prd = None
    try:
        prd = build_with_claude(md_file, branch_name)
        if prd:
            print(f"  Claude generated prd.json with {len(prd['userStories'])} stories")
        else:
            print("  Claude output could not be parsed, using fallback parser")
    except Exception as e:
        print(f"  Claude error ({e}), using fallback parser")

    # Fallback: parse markdown ourselves
    if prd is None:
        prd = fallback_prd(md_file, branch_name)
        print(f"  Fallback parser generated prd.json with {len(prd['userStories'])} stories")

    with open(output_path, "w") as f:
        json.dump(prd, f, ensure_ascii=False, indent=2)

    print(f"  Written: {output_path}")


if __name__ == "__main__":
    main()
