import { useEffect, useRef, useState } from "react";
import { moviesTest } from "@/data/moviesTest";
import { INetflixItem } from "@/models/Netflix";
import { SwiperSlide, Swiper } from "swiper/react";
import { MovieItem } from "./MovieItem";
import { useInView } from "react-intersection-observer";
import { useItem } from "@/hooks";
import { useNetflix } from "@/hooks/useNetflix";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

interface Props {
  url?: string;
  special?: boolean;
  offset?: number;
  type?: string;
  browser?: boolean;
}
export const ListMovies = ({
  url = "",
  special,
  offset = 0,
  type = "",
  browser,
}: Props) => {
  const { getByCategory, getMovies } = useItem();
  const { onSetItem, onToggleItem } = useNetflix();

  const [data, setData] = useState<INetflixItem[]>([]);
  const [limit, setLimit] = useState(-20);

  const [maxLimit, setMaxLimit] = useState(0);

  const { ref, inView: groupItems } = useInView({ triggerOnce: true });
  const { ref: ref2, inView: lastItem } = useInView();

  const getDataType = async () => {
    const { data: dataType, maxLimit } = await getMovies(
      offset + limit + 20,
      type
    );
    setLimit(limit + 20);
    setMaxLimit(maxLimit);
    setData(special ? dataType.slice(0, 10) : [...data, ...dataType]);
  };

  const getDataCategory = async () => {
    const { data: dataCat, maxLimit } = await getByCategory(url, limit + 20);

    setLimit(limit + 20);
    setMaxLimit(maxLimit);
    setData(special ? dataCat.slice(0, 10) : [...data, ...dataCat]);
  };

  useEffect(() => {
    if (groupItems && data.length == 0) {
      if (offset >= 0 && url == "") {
        getDataType();
      } else {
        getDataCategory();
      }
    }
  }, [groupItems]);

  useEffect(() => {
    if (lastItem) {
      if (offset >= 0 && url == "") {
        getDataType();
        return;
      }

      if (!special) getDataCategory();
    }
  }, [lastItem]);

  return (
    <div ref={ref} style={{ display: "flex" }}>
      <Swiper
        style={{
          padding: `0 ${
            special
              ? browser
                ? "10rem 0 10rem"
                : "1rem 0 4rem"
              : browser
              ? "5rem"
              : "1rem"
          }`,
          height: "16rem",
        }}
        slidesPerView={browser ? 5 : "auto"}
        spaceBetween={special ? (browser ? 100 : 40) : 5}
        navigation={browser}
        slidesPerGroup={browser ? 5 : undefined}
        modules={[Navigation]}
        grabCursor={!browser}
      >
        {data.length == 0 ? (
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => (
            <SwiperSlide key={`skeletonList-${i}`} style={{ width: "11rem" }}>
              <MovieItem />
            </SwiperSlide>
          ))
        ) : (
          <>
            {data.map((movie, i) => (
              <SwiperSlide
                key={movie.netflix_id}
                style={{ width: "11rem" }}
                onClick={() => {
                  onSetItem(movie);
                  onToggleItem();
                }}
              >
                <MovieItem
                  img={movie.img}
                  browser={browser}
                  number={special ? i + 1 : null}
                />
              </SwiperSlide>
            ))}
          </>
        )}

        {limit < maxLimit && !special && (
          <SwiperSlide style={{ width: "11rem" }}>
            <div ref={ref2} style={{ color: "#FFF" }}>
              <MovieItem browser={browser} />
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};
