import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import { Controller, Scene } from "react-scrollmagic";
import { Timeline, Tween } from "react-gsap";
import drops from "../images/drops.png";
import { Post } from "../components/Post";
import { fetchPosts, fetchTags } from "../redux/slices/posts";

export const HomePage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts } = useSelector((state) => state.posts);
  const isPostsLoading = posts.status === "loading";

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  return (
    <>
      <p
        className="animate__animated animate__fadeInRight animate__slow	2s"
        style={{
          position: "absolute",
          top: "150px",
          right: "150px",
          color: "#fff",
          fontSize: "35px",
        }}
      >
        Welcome to our blog,
        <br />
        we hope you find
        <br />
        useful blog
        <br />
        or write a blog yourself.
      </p>

      <Grid
        container
        direction="row-reverse"
        justifyContent="center"
        alignItems="center"
      >
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Controller>
                <Scene
                  duration={1000}
                  pin={true}
                  indicators={false}
                  triggerHook="onLeave"
                >
                  {(progress) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100vh",
                        overflow: "hidden",
                      }}
                    >
                      <Timeline totalProgress={progress} paused>
                        <Tween
                          from={{ y: "0vh", scale: 1 }}
                          to={{ y: "10vh", scale: 0.8 }}
                          duration={1000}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100vh",
                              transition: "transform .4s ease-out",
                              position: "absolute",
                              zIndex: 2,
                            }}
                          >
                            <Post
                              id={obj._id}
                              title={obj.title}
                              imageUrl={
                                obj.imageUrl
                                  ? `http://localhost:4444/${obj.imageUrl}`
                                  : ""
                              }
                              user={obj.user}
                              createdAt={obj.createdAt}
                              viewsCount={obj.viewsCount}
                              commentsCount={3}
                              tags={obj.tags}
                              isEditable={userData?._id === obj.user._id}
                            />
                          </div>
                        </Tween>

                        <Tween
                          from={{ y: "80vh", opacity: 0.3 }}
                          to={{ y: "40vh", opacity: 0.6 }}
                          duration={1000}
                        >
                          <img
                            src={drops}
                            style={{
                              width: "100%",
                              transition: "transform .4s ease-out",
                              position: "absolute",
                              zIndex: 2,
                            }}
                          />
                        </Tween>
                      </Timeline>
                    </div>
                  )}
                </Scene>
              </Controller>
            )
          )}
        </Grid>
      </Grid>
    </>
  );
};
