import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';
let isFirstSearch = true;

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
  loadMoreBtn.style.display = 'none';

  await fetchImages();
});

loadMoreBtn.addEventListener('click', fetchImages);

async function fetchImages() {
  try {
    const response =
      await axios(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}
        `);
    const data = response.data;

    if (data.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (isFirstSearch) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        isFirstSearch = false;
    }
      
    data.hits.forEach(image => {
      const card = document.createElement('a');
      card.href = image.largeImageURL;
      card.classList.add('photo-card');
      card.innerHTML = `
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
        <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
    `;
      gallery.appendChild(card);
    });

    if (page < Math.ceil(data.totalHits / 40)) {
      page = +1;
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
      if (data.totalHits === 0) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      }
      const lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure(
      'Oops! Something went wrong while fetching images.'
    );
  }
}
