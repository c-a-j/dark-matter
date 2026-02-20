import { getCollection } from "astro:content";
import path from "path";
import type { MarkdownPost, MarkdownCollectionName} from "../lib/types";
const baseUrl = import.meta.env.BASE_URL;
const isDev = import.meta.env.DEV;

 
 /**
  * Processes the date of an article and returns a string representing the processed date.
  * @param timestamp the timestamp to process
  * @returns a string representing the processed timestamp
  */
export const processDate = (date: Date | undefined | null) => {
  if (!date) return "";
  const monthSmall = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${monthSmall} ${day}, ${year}`;
};

const getSortDate = (post: MarkdownPost) => {
  return post.published ?? post.updated ?? new Date(0);
}

export const getPublishedCollection = async (
  collectionName: MarkdownCollectionName
) => {
  const entries = await getCollection(collectionName);
  const data = (post: (typeof entries)[number]) => post.data as MarkdownPost

  return entries
    .filter(post => {
      if (isDev) return true;
      return !data(post).draft;
    })
    .map(post => {
      const filePath = post.filePath;
      const dir = filePath ? path.dirname(filePath) : ".";
      const slug = post.data.slug;

      const urlPath = `${dir}/${slug}`.replace(/\/?content\//, "");
      const collectionRelativePath = urlPath.replace(
        new RegExp(`\/?${collectionName}\/`),
        ""
      );

      return {
        entry: post,
        url: getUrl(urlPath),
        collectionRelativePath,
        filePath,
      };
    });
};

export const getCollectionStaticPaths = async (
  collectionName: MarkdownCollectionName
) => {
  const entries = await getPublishedCollection(collectionName);
  return entries.map(({ entry, collectionRelativePath }) => ({
    params: { path: collectionRelativePath },
    props: {
      entry: entry as typeof entry & { filePath: string },
    },
  }));
};

export const getPosts = async (
  collectionName: MarkdownCollectionName
) => {
  const posts = await getPublishedCollection(collectionName);
  return posts.map(({ entry, ...rest }) => {
    return {
      ...entry.data,
      ...rest,
    };
  });
};

const sortPostsAscending = (
  posts: MarkdownPost[]
) => {
  return [...posts].sort(
    (a, b) => getSortDate(a).getTime() - getSortDate(b).getTime()
  );
}

const sortPostsDescending = (
  posts: MarkdownPost[]
) => {
  return [...posts].sort(
    (a, b) => getSortDate(b).getTime() - getSortDate(a).getTime()
  );
}

export const getPostsAscending = async (
  collectionName: MarkdownCollectionName
) => {
  const posts = (await getPosts(collectionName)) as MarkdownPost[];
  return [...posts].sort(
    (a, b) => getSortDate(a).getTime() - getSortDate(b).getTime()
  );
};

export const getPostsDescending = async (
  collectionName: MarkdownCollectionName
) => {
  const posts = (await getPosts(collectionName)) as MarkdownPost[];
  return [...posts].sort(
    (a, b) => getSortDate(b).getTime() - getSortDate(a).getTime()
  );
};

export const getFeaturedPosts = async (
  collectionName: MarkdownCollectionName
) => {
  const posts = await getPostsDescending(collectionName);
  const featured = posts
    .filter(post => post.feature === true)
    .filter(post => post.hide === false)
    .slice(0, 5);
  return featured;
};

export const getVisiblePosts = async (
  collectionName: MarkdownCollectionName
) => {
  const posts = await getPostsDescending(collectionName);
  const visible = posts.filter(post => post.hide === false);
  return visible;
};

export const getUrl = (p: string) => {
  const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  const path = p.startsWith("/") ? p.slice(1, p.length) : p;
  return base + path;
};

// Filter posts that are in the specified subdirectory
export const getSubCollection = async (
  collectionName: MarkdownCollectionName,
  indexDirectory: string
) => {
  const posts = await getPostsAscending(collectionName);
  return posts.filter(post => {
    const dir = path.dirname(post.collectionRelativePath);
    return dir === indexDirectory;
  });
};

/** Strip trailing slash for consistent URL comparison. */
const normalizeUrl = (url: string) =>
  url.endsWith("/") ? url.slice(0, -1) : url;

/** Find the next and previous posts relative to the current URL. */
const findAdjacentPosts = (
  posts: { url: string; title: string }[],
  currentUrl: string
) => {
  const normalized = normalizeUrl(currentUrl);
  const currentIndex = posts.findIndex(p => normalizeUrl(p.url) === normalized);
  return {
    next:
      currentIndex >= 0 && currentIndex < posts.length - 1
        ? posts[currentIndex + 1]
        : null,
    previous: currentIndex > 0 ? posts[currentIndex - 1] : null,
  };
};

interface getPaginationInfoProps {
  url: string;
  collectionName: MarkdownCollectionName;
  isSubcollection: boolean;
}
export const getPaginationInfo = async ({
  url,
  collectionName,
  isSubcollection,
}: getPaginationInfoProps) => {
  if (isSubcollection) {
    const collectionRelativePath = path
      .dirname(url)
      .replace(new RegExp(`\/?${collectionName}\/`), "");
    const posts = await getSubCollection(
      collectionName,
      collectionRelativePath
    );
    const sorted = posts.sort((a, b) =>
      path.basename(a.filePath).localeCompare(path.basename(b.filePath))
    );
    return findAdjacentPosts(sorted, url);
  }

  const posts = (await getPosts(collectionName)) as MarkdownPost[];
  const collectionPosts = sortPostsAscending(
    posts.filter((post) => {
      return (!post.isSubcollection && !post.draft && post.paginate)
    })
  )
  
  
  return findAdjacentPosts(collectionPosts, url);
};
