import axios from 'axios';
import { PER_PAGE, API_KEY } from '../utils/constants';

const imageAgent = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: API_KEY,
    image_type: 'photo',
    per_page: PER_PAGE,
    orientation: 'horizontal',
    safesearch: true,
  },
});

export async function getImages(query, page) {
  try {
    const {
      data: { hits, totalHits },
    } = await imageAgent.get('', {
      params: {
        q: query,
        page,
      },
    });
    return { images: hits, totalImages: totalHits };
  } catch (error) {
    return error;
  }
}
