import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

let page = 1;
let searchQuery = '';
let loadingImages = false;
let totalHits = 0;

const API_KEY = '38906051-b75951c25e9106fdf3cf1ae5b';
const BASE_URL = 'https://pixabay.com/api/';

form.addEventListener('submit', async event => {
  event.preventDefault();
  searchQuery = event.target.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  page = 1;
  gallery.innerHTML = '';

  await fetchImages();
});

window.addEventListener('scroll', async () => {
  const scrollPosition = window.scrollY + window.innerHeight;
  const pageHeight = document.body.scrollHeight;

  if (scrollPosition >= pageHeight) {
    await fetchImages();
  }
});

async function fetchImages() {
  if (loadingImages) {
    return;
  }

  loadingImages = true;

  try {
    const response = await axios(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}`
    );
    const data = response.data;

    if (data.hits.length === 0) {
      Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (page === 1) {
        totalHits = data.totalHits;
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }

    data.hits.forEach(image => {
      const card = document.createElement('a');
      card.href = image.largeImageURL;
      card.classList.add('photo-card');
      card.innerHTML = `
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
        <div class="info">
            <p class="info-item"><b>Likes</b> ${image.likes}</p>
            <p class="info-item"><b>Views</b> ${image.views}</p>
            <p class="info-item"><b>Comments</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
        </div>
    `;
      gallery.appendChild(card);
    });

    loadingImages = false;

    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

      page += 1;

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure(
      'Oops! Something went wrong while fetching images.'
    );

    loadingImages = false;
  }
}