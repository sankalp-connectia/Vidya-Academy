// WordPress-managed articles. The frontend displays the newest published
// posts first and paginates them six at a time.
export let blogsPage = {
  eyebrow: "Stories from Vidya Academy",
  title: "Ideas, moments & updates",
  description: "News and stories from our learning community.",
  readMoreLabel: "Read article",
  publishedLabel: "Published",
  emptyTitle: "Stories are on their way",
  emptyDescription: "Please check back soon for news and updates from Vidya Academy.",
};

// A clearly labelled preview keeps the blog page demonstrable before an
// approved article is entered in WordPress. Real WordPress posts replace it.
const sampleBlogPreview = {
  slug: "sample-preview-learning-through-play",
  title: "Sample preview: Learning through play",
  description: "Preview article for the blog layout. Replace this sample with an approved Vidya Academy story in WordPress.",
  image: "/images/school/learning-through-play.webp",
  imageAlt: "Children playing and learning together on the lawn",
  gallery: [
    { image: "/images/school/building-blocks.webp", imageAlt: "Children working together with building blocks", caption: "Playing together with building blocks." },
    { image: "/images/school/climbing-wall.webp", imageAlt: "Children climbing a colourful play wall", caption: "Active play at Vidya Academy." },
  ],
  publishedAt: "2026-11-04",
  content: [
    {
      heading: "A sample article preview",
      paragraphs: [
        "This placeholder shows how a blog article will appear on the Vidya Academy website. It is sample content and does not describe a specific school event or announcement.",
        "Replace the title, image and article text by publishing an approved post in WordPress. The live post will take the place of this preview automatically.",
      ],
      bulletPoints: ["Use headings to break up a story.", "Add a photo caption when it helps explain the image."],
    },
  ],
};

export let blogs = [sampleBlogPreview];

export function applyWordPressContent(content = {}) {
  if (Array.isArray(content)) {
    blogs = content.length ? content : [sampleBlogPreview];
    return;
  }
  if (!content || typeof content !== "object") return;
  if (Object.prototype.hasOwnProperty.call(content, "blogsPage")) blogsPage = content.blogsPage;
  if (Object.prototype.hasOwnProperty.call(content, "blogs") && Array.isArray(content.blogs)) {
    blogs = content.blogs.length ? content.blogs : [sampleBlogPreview];
  }
}
