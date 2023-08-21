import Notiflix from 'notiflix';
import { fetchImages } from './api.js';
import { renderGallery } from './html.js';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');

let page = 1;
let searchQuery = '';
let loadingImages = false;
let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();
  searchQuery = event.target.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  page = 1;
  gallery.innerHTML = '';

  await loadAndRenderImages();
});

window.addEventListener('scroll', async () => {
  const scrollPosition = window.scrollY + window.innerHeight;
  const pageHeight = document.body.scrollHeight;

  if (scrollPosition >= pageHeight) {
    await loadAndRenderImages();
  }
});

async function loadAndRenderImages() {
  if (loadingImages) {
    return;
  }

  loadingImages = true;

  try {
    const data = await fetchImages(searchQuery, page);

    if (page === 1) {
      totalHits = data.totalHits;
      showSuccessMessage(totalHits);
    }

    renderGallery(data, gallery, lightbox);

    loadingImages = false;

    page += 1;
  } catch (error) {
    loadingImages = false;
    Notiflix.Notify.failure(
      'Oops! Something went wrong while fetching images.'
    );
  }
}

function showSuccessMessage(totalHits) {
  if (totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}
