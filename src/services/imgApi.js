import axios from 'axios';

const imageAgent = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '34376163-a7d9ba919838b460ea8d86c54',
    image_type: 'photo',
    per_page: 12,
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
