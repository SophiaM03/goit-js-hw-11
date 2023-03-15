import { Notify } from 'notiflix';
import { getImages } from './services/imgApi';
import { galleryMarkup } from './templates/gallery';
import Simplelightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Loader } from './templates/spinner';
import { renderLoader } from './utils/renderLoader';
import { PER_PAGE } from './utils/constants';

const modalInstance = new Simplelightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

const state = {
  page: 1,
};

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loaderBox: document.querySelector('.loader'),
};

const observerOptions = {
  rootMargin: '0px',
  threshold: 0.6,
};

const observer = new IntersectionObserver(onLoadmoreImages, observerOptions);

refs.form.addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  const query = e.target.searchQuery.value.trim();
  if (!query) {
    Notify.warning('Enter some query');
    return;
  }
  refs.gallery.innerHTML = '';
  state.page = 1;
  try {
    renderLoader('pending', refs.loaderBox, Loader);

    const { images, totalImages } = await getImages(query, state.page);
    if (!images.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const markup = galleryMarkup(images);
    refs.gallery.innerHTML = markup;
    modalInstance.refresh();
    observer.observe(refs.gallery.lastElementChild);
    Notify.success(`Hooray! We found ${totalImages} images.`);
  } catch (error) {
    Notify.failure(error.message);
  } finally {
    renderLoader('remove', refs.loaderBox);
  }
}

async function onLoadmoreImages([entry], obs) {
  if (entry.isIntersecting) {
    obs.unobserve(entry.target);
    state.page += 1;
    try {
      const query = refs.form.searchQuery.value.trim();
      if (!(refs.gallery.children.length % PER_PAGE)) {
        renderLoader('pending', refs.loaderBox, Loader);
      }
      const { images, totalImages } = await getImages(query, state.page);
      if (refs.gallery.children.length + PER_PAGE >= totalImages) {
        Notify.info(`Sorry, there is all images by query ${query}`);
        return;
      }
      refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup(images));
      modalInstance.refresh();
      obs.observe(refs.gallery.lastElementChild);
    } catch (error) {
      Notify.failure(error.message);
    } finally {
      renderLoader('remove', refs.loaderBox);
    }
  }
}
