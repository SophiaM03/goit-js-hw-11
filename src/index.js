import { Notify } from 'notiflix';
import { getImages } from './services/imgApi';
import { galleryMarkup } from './templates/gallery';
import Simplelightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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
};

const observerOptions = {
  threshold: 0.5,
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
  state.page = 1;
  try {
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
  }
}

async function onLoadmoreImages(entries) {
  console.log(observer);
  state.page += 1;
  try {
    const { images, totalImages } = await getImages(
      refs.form.searchQuery.value.trim(),
      state.page
    );
    refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup(images));
    modalInstance.refresh();
  } catch (error) {
    Notify.failure(error.message);
  }
}
