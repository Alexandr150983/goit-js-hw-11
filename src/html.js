import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export function renderGallery(data, galleryElement, lightbox) {
  if (data.hits.length === 0) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
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
    galleryElement.appendChild(card);
  });

  lightbox.refresh();
}
