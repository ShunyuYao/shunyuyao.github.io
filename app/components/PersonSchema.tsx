const BASE_URL = "https://shunyuyao.github.io";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shunyu Yao",
  alternateName: "姚顺宇",
  url: BASE_URL,
  jobTitle: "AIGC Researcher & Product Builder",
  worksFor: {
    "@type": "Organization",
    name: "Chuangyi Technology",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Shanghai Jiao Tong University",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Xi'an Jiaotong University",
    },
  ],
  email: "ysy2017@sjtu.edu.cn",
  sameAs: ["https://onestory.art", "https://github.com/ShunyuYao"],
};

export default function PersonSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}
