import './css/styles.css';
import PhotoClass from './js/fetchFind';
import 'simplelightbox/dist/simple-lightbox.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const photoClass = new PhotoClass();
const axios = require('axios').default;

let observer = new IntersectionObserver(scrollEndless, {rootMargin:'170px',})

const refs = {
  btnSumbit:document.querySelector('#search-form'),
  galleryMarkup:document.querySelector('.gallery'),
  btnSearch:document.querySelector('.btn-search')
  // btnLoadMore:document.querySelector('.load-more')
};

let lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

refs.btnSumbit.addEventListener('submit',searchImg);

refs.btnSumbit.addEventListener('input',(e)=>{
  if(e.target.value !== "" && e.target.value !== " "){
    refs.btnSearch.removeAttribute("disabled")

  }else {
    refs.btnSearch.setAttribute("disabled","disabled")
  }
})

// refs.btnLoadMore.addEventListener('click',loadMore)
// async function loadMore(){
//   console.log(photoClass)
//   try{
//     renderImg(await photoClass.fetchFindImage());
//     const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 40,
//   behavior: "smooth",
// });
//   }catch(error){
//     console.log(error)
//   }
// }

async function searchImg (e){
  e.preventDefault();
  clearMarkup();
  photoClass.query = e.currentTarget.elements.searchQuery.value
  photoClass.resetPage()
  try {
    renderImg(await photoClass.fetchFindImage());
    if (photoClass.totalHits ===0){
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return
    }
    Notify.success(`Hooray! We found ${photoClass.totalHits} images.`);
  }catch(error){
    Notify.failure(error);
  }
  lightbox.refresh();
};



function clearMarkup(){
refs.galleryMarkup.innerHTML="";
};

function renderImg({data}){
    const markup = data.hits.map(mark=>{return `<div class="photo-card"><a class="gallery__item" href='${mark.largeImageURL}'>
    <img class="gallery__image" src="${mark.webformatURL}" alt="${mark.tags}" loading="lazy"/></a>
    <div class="info">
      <p class="info-item">
        <b>Likes:</b>${mark.likes}
      </p>
      <p class="info-item">
        <b>Views:</b>${mark.views}
      </p>
      <p class="info-item">
        <b>Comments:</b>${mark.comments}
      </p>
      <p class="info-item">
        <b>Downloads:</b>${mark.downloads}
      </p>
    </div>
    
  </div>
  `}).join('')
  console.log(data)
  // refs.btnLoadMore.classList.remove('is-hidden')
  refs.galleryMarkup.insertAdjacentHTML('beforeend',markup);
  lightbox.refresh();
  observer.observe(refs.galleryMarkup.lastElementChild)
};



function scrollEndless(eteries){
eteries.forEach(eter=>{
  if(eter.isIntersecting && photoClass.query  !==''){
    if(photoClass.endPhotoRender()){
      Notify.failure(`We're sorry, but you've reached the end of search results.`);
      return
    }
    try{
  photoClass.fetchFindImage().then(renderImg);
  console.log(eter.target)
  observer.unobserve(eter.target);
}catch(error){
  Notify.failure(error);
}
  }

});
};
