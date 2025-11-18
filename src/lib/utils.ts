
import { getCollection } from "astro:content";
import path from "path";

import type { collections } from "../content.config";
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
  const posts = await getCollection(collectionName);
  
  return posts
    .filter((post) => {
      if (isDev) {
        return true;
      } else {
        return !post.data.draft;
      }
    })
    .map((post) => {
      const filePath = post.id;
      const dir = path.dirname(filePath);
      
      const urlPath = dir !== '.' 
        ? `${collectionName}/${dir}/${post.data.slug}`
        : `${collectionName}/${post.data.slug}`;
      
      const staticPath = dir !== '.' 
        ? `${dir}/${post.data.slug}` 
        : post.data.slug;
      
      return {
        entry: post,
        url: getUrl(urlPath),
        staticPath,
      };
    });
};

export const getCollectionStaticPaths = async (collectionName: keyof typeof collections) => {
  const results = await getPublishedCollection(collectionName);
  return results.map(({ entry, staticPath }) => ({
    params: { path: staticPath },
    props: { 
      entry: {
        ...entry,
        data: {
          ...entry.data,
        },
      },
    },
  }));
}

export const getPosts = async (collectionName: keyof typeof collections) => {
  const results = await getPublishedCollection(collectionName);
  return results.map(({ entry, url }) => ({
    ...entry.data,
    id: entry.id,
    url,
  }));
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
    const dir = path.dirname(post.id);
    return dir === indexDirectory;
  });
}
