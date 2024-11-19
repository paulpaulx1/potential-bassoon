<script lang="ts">
  import { goto } from '$app/navigation';
  import type { Painting } from '$lib/types';
  export let painting: Painting;
  export let paintings: Painting[];
  export let onClose: () => void;
  
  let dialog: HTMLDialogElement | null = null;
  let fullImageLoaded = false;
  let preloadedImages = new Set<string>();
 
  function getNavigation(current: Painting) {
    const idx = paintings.findIndex((p) => p.slug === current.slug);
    return {
      prev: paintings[(idx - 1 + paintings.length) % paintings.length],
      next: paintings[(idx + 1) % paintings.length]
    };
  }
 
  function preloadImage(url: string) {
    if (!preloadedImages.has(url)) {
      const img = new Image();
      img.src = url;
      preloadedImages.add(url);
    }
  }
 
  function preloadNavigationImages() {
    const { prev, next } = getNavigation(painting);
    // Preload both full and blur versions
    [prev, next].forEach(p => {
      preloadImage(p.fullImageUrl);
      preloadImage(p.blurImageUrl);
    });
  }
 
  function handleImageLoad() {
    fullImageLoaded = true;
    preloadNavigationImages();
  }
 
  function handleClose() {
    dialog?.close();
    goto('/', { replaceState: true });
  }
 
  $: if (dialog) dialog.showModal();
 </script>
 
 <dialog bind:this={dialog} class="overlay">
  <div class="content">
    <div class="image-container">
      <img 
        src={painting.blurImageUrl} 
        class="blur-thumb" 
        class:hidden={fullImageLoaded} 
        alt="" 
      />
      <img
        src={painting.fullImageUrl}
        alt={painting.title}
        class:loaded={fullImageLoaded}
        on:load={handleImageLoad}
      />
    </div>
 
    <nav class="navigation">
      <a
        href={`/work/${getNavigation(painting).prev.slug}`}
        class="nav-button prev"
        aria-label={`View previous work: ${getNavigation(painting).prev.title}`}
      >
        ‹
      </a>
      
      <div class="info">
        <h2>{painting.title}</h2>
        <p>{painting.description}</p>
      </div>
 
      <a
        href={`/work/${getNavigation(painting).next.slug}`}
        class="nav-button next"
        aria-label={`View next work: ${getNavigation(painting).next.title}`}
      >
        ›
      </a>
    </nav>
 
    <button 
      class="close-button" 
      on:click={handleClose}
      aria-label="Close and return to gallery"
    >
      ×
    </button>
  </div>
 </dialog>
 
 <style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.94);
    border: none;
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
  }
 
  .content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
 
  .image-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
 
  .blur-thumb, img:not(.blur-thumb) {
    max-height: 70vh;
    max-width: 70vw;
    transition: opacity 0.5s ease;
  }
 
  .blur-thumb {
    filter: blur(10px);
    transform: scale(1.05);
  }
 
  img:not(.blur-thumb) {
    position: absolute;
    opacity: 0;
  }
 
  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 2rem;
  }
 
  .nav-button {
    color: rgb(71, 71, 71);
    font-size: 4rem;
    text-decoration: none;
    padding: 1rem;
    transition: color 0.2s;
  }
 
  .nav-button:hover {
    color: rgb(40, 40, 40);
  }
 
  .close-button {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: none;
    border: none;
    color: rgb(40, 40, 40);
    font-size: 2rem;
    cursor: pointer;
  }
 
  .info {
    text-align: center;
    color: rgb(40, 40, 40);
  }
 
  .hidden {
    opacity: 0;
  }
 
  .loaded {
    opacity: 1 !important;
  }
 </style>