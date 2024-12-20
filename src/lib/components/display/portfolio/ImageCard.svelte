<script lang="ts">
interface Props {
    title: string;
    description: string;
    fullImageUrl: string;
    blurImageUrl: string;
    slug: string;
  }
  let props: Props = $props();
  let { title, description, fullImageUrl, blurImageUrl, slug } = props;
  let fullImageLoaded = $state(false);

</script>

<a href={`/work/${slug}`} class="card">
  <div class="image-container">
    <img
      src={blurImageUrl}
      class="blur-thumb"
      class:hidden={fullImageLoaded}  
      alt=""
    />
    <img
      src={fullImageUrl}
      alt={title}
      class:loaded={fullImageLoaded}
      onload={() => fullImageLoaded = true}
      loading="lazy"
      decoding="async"
    />
  </div>
  
  <div class="info">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
</a>

<style>
  .card {
		text-decoration: none;
		color: inherit;
		padding: 16px;
		border-radius: 8px;
		background: white;
		transition: outline 0.2s;
	}

	.card:focus, .card:hover {
		outline: 3px solid rgb(56, 56, 56);
		outline-offset: 2px;
	}
  .image-container {
    position: relative;
    aspect-ratio: 3/4;
    width: 100%;
  }

  .blur-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(10px);
    transform: scale(1.03);
    transition: opacity 0.35s ease;  
  }

  .hidden {
    opacity: 0;
  }

  img:not(.blur-thumb) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  .loaded {
    opacity: 1 !important;
  }

  .info {
    font-family: Inter;
    text-align: center;
    color: rgb(40, 40, 40);
    padding: 20px;
  }
</style>