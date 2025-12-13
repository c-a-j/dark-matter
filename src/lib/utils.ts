
import { getCollection } from "astro:content";
import path from "path";

import type { collections } from "../content.config";
import { colorForIntegration } from "astro/runtime/client/dev-toolbar/apps/utils/icons.js";
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

const getPublishedCollection = async (collectionName: keyof typeof collections) => {
  const entries = await getCollection(collectionName);
  
  return entries
    .filter((post) => {
      if (isDev) {
        return true;
      } else {
        return !post.data.draft;
      }
    })
    .map((post) => {
      const filePath = post.filePath;
      const dir = filePath ? path.dirname(filePath) : '.';
      const slug = post.data.slug;

      const urlPath = `${dir}/${slug}`.replace(/\/?content\//, '')
      const collectionRelativePath = urlPath.replace(new RegExp(`\/?${collectionName}\/`), '')

      return {
        entry: post,
        url: getUrl(urlPath),
        collectionRelativePath,
        filePath,
      };
    });
};

export const getCollectionStaticPaths = async (collectionName: keyof typeof collections) => {
  const entries = await getPublishedCollection(collectionName);
  return entries.map(({ entry, collectionRelativePath }) => ({
    params: { path: collectionRelativePath },
    props: { 
      entry: entry as typeof entry & { filePath: string },
    },
  }));
}

export const getPosts = async (collectionName: keyof typeof collections) => {
  const posts = await getPublishedCollection(collectionName);
  return posts.map(({ entry, ...rest }) => {
    return {
      ...entry.data,
      ...rest,
    }
  });
};

export const getPostsAscending = async (collectionName: keyof typeof collections) => {
  const posts = await getPosts(collectionName)
  const sorted = posts
    .sort((a, b) => {
      // Sort by published date, fallback to updated date, then by title
      const dateA = a.published || a.updated || new Date(0);
      const dateB = b.published || b.updated || new Date(0);
      return dateA.getTime() - dateB.getTime();
    })
  return sorted;
}

export const getPostsDescending = async (collectionName: keyof typeof collections) => {
  const posts = await getPosts(collectionName)
  const sorted = posts
    .sort((a, b) => {
      // Sort by published date, fallback to updated date, then by title
      const dateA = a.published || a.updated || new Date(0);
      const dateB = b.published || b.updated || new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
  return sorted;
}

export const getFeaturedPosts = async (collectionName: keyof typeof collections) => {
  const posts = await getPostsDescending(collectionName)
  const featured = posts
    .filter((post) => post.feature === true)
    .filter((post) => post.hide === false)
    .slice(0,5)
  return featured;
}

export const getVisiblePosts = async (collectionName: keyof typeof collections) => {
  const posts = await getPostsDescending(collectionName)
  const visible = posts
    .filter((post) => post.hide === false)
  return visible;
}

export const getUrl = (p: string) => {
  const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  const path = p.startsWith("/") ? p.slice(1, p.length) : p;
  return base + path;
}

// Filter posts that are in the specified subdirectory
export const getSubCollection = async (collectionName: keyof typeof collections, indexDirectory: string) => {
  const posts = await getPostsAscending(collectionName)
  return posts.filter((post) => {
    const dir = path.dirname(post.collectionRelativePath);
    return dir === indexDirectory;
  });
}

interface getPaginationInfoProps {
  url: string; 
  collectionName: keyof typeof collections;
  isSubcollection: boolean;
}
export const getPaginationInfo = async ({ url, collectionName, isSubcollection }: getPaginationInfoProps) => {
  let paginationInfo = undefined;
  let next = null;
  let previous = null;

  console.log("DEBUG: -------------------------------");
  console.log("DEBUG: url:", url);
  console.log("DEBUG: collectionName:", collectionName);
  console.log("DEBUG: isSubcollection:", isSubcollection);

  if (isSubcollection) {
    const collectionRelativePath = path.dirname(url).replace(new RegExp(`\/?${collectionName}\/`), '')
    console.log("DEBUG: collectionRelativePath:", collectionRelativePath);
    const posts= await getSubCollection(collectionName, collectionRelativePath);
    const sortedPosts = posts.sort((a, b) => {
      const filenameA = path.basename(a.filePath);
      const filenameB = path.basename(b.filePath);
      return filenameA.localeCompare(filenameB);
    });

    const currentIndex = sortedPosts.findIndex((p) => {
      const postUrl = p.url.endsWith('/') ? p.url.slice(0, -1) : p.url;
      const currentUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      return currentUrl === postUrl;
    });
    next = currentIndex >= 0 && currentIndex < sortedPosts.length - 1 
      ? sortedPosts[currentIndex + 1] 
      : null;
    previous = currentIndex > 0 
      ? sortedPosts[currentIndex - 1] 
      : null;
  } else {
    const posts = await getPostsDescending(collectionName);
    const currentIndex = posts.findIndex((p) => {
      const postUrl = p.url.endsWith('/') ? p.url.slice(0, -1) : p.url;
      const currentUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      return currentUrl === postUrl;
    });
    next = currentIndex >= 0 && currentIndex < posts.length - 1 
      ? posts[currentIndex + 1] 
      : null;
    previous = currentIndex > 0 
      ? posts[currentIndex - 1] 
      : null;
  }
  paginationInfo = {
    next,
    previous,
  };
  console.log("DEBUG: paginationInfo:", paginationInfo);
  console.log("DEBUG: -------------------------------");
  return paginationInfo;
}