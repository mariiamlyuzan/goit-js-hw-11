
const axios = require('axios').default;
import Notiflix from 'notiflix';
import LoadMoreBtn from './btn';
const loadMoreBtn = new LoadMoreBtn({ selector: '[data-action="load-more"]',
hidden: true, });

const API_KEY = '24406389-80d19f3f64d36bf4e48f43e71';
const BASE_URL = 'https://pixabay.com/api/';

  export default class NewsApiService {
    constructor() {
      this.searchQuery = '';
      this.page = 1;
    }
  
  async fetchImages() {
      const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&page=${this.page}&per_page=40`;
      
      const image = await axios.get(url);
      this.incrementPage();

      return image.data;
    }

    endImages() {
      if(this.page === 13) {
      Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
      loadMoreBtn.hide();
      }
       } 

    incrementPage() {
      this.page += 1;
    }
  
    resetPage() {
      this.page = 1;
    }
  
    get query() {
      return this.searchQuery;
    }
  
    set query(newQuery) {
      this.searchQuery = newQuery;
    }
  }