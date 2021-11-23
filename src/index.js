
const axios = require('axios').default;
import Notiflix from 'notiflix';
import galleryTpl from '../src/templates/gallery.hbs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import NewsApiService from './js/news-api';
import LoadMoreBtn from './js/btn';

var lightbox = new SimpleLightbox('.gallery a', { 
  captionDelay: 250
})

const refs = {
  form: document.querySelector('#search-form'),
  div: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({ selector: '[data-action="load-more"]',
hidden: true, });
const newsApiService = new NewsApiService();

refs.form.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function onSearch(e) {
 e.preventDefault();
 clearImagesGallery();
 newsApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
 
  loadMoreBtn.show();
  newsApiService.resetPage();
  loadMoreBtn.disable();

  const image = await newsApiService.fetchImages();
  renderImages(image);
  const btn = await loadMoreBtn.enable();
   lightbox.refresh();
}

function renderImages(image) {
  if(image.hits.length === 0) {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  loadMoreBtn.hide();
  }
  const markup = galleryTpl(image);
  refs.div.insertAdjacentHTML('beforeend', markup);
}

function clearImagesGallery() {
  refs.div.innerHTML = '';
}

async function onLoadMore() {
  loadMoreBtn.disable();
  const image = await newsApiService.fetchImages();
  renderImages(image);
  const btn = await loadMoreBtn.enable();
  newsApiService.endImages();

 scroll();
 lightbox.refresh();
 
  let totalHits = image.totalHits;
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
 
}

function scroll() {
 const { height: cardHeight } = refs.div.firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}