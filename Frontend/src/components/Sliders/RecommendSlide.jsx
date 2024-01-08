import { SwiperSlide } from "swiper/react";
import AutoSwiper from "../Swipers/AutoSwiper";
import MediaItem from "../Media/MediaItem";

const RecommendSlide = ({ medias, mediaType }) => {
  return (
    <AutoSwiper>
      {medias.map((media, index) => (
        <SwiperSlide key={index}>
          <MediaItem media={media} mediaType={mediaType} />
        </SwiperSlide>
      ))}
    </AutoSwiper>
  );
};

export default RecommendSlide;