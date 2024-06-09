import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';

const swiper = new Swiper('.swiper', {
    modules: [Navigation, Pagination],
    speed: 400,
    spaceBetween: 100,
  });