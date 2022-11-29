import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { useAuthState } from "../../context/auth";

const SubPage = () => {
  const [ownSub, setOwnSub] = useState(false);
  const { authenticated, user } = useAuthState();

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const subName = router.query.sub;

  // { data, error, isValidating, mutate } 객체 구조분해 할당
  // error와 data만 잡아주기(data는 sub이라는 별칭으로 잡음)
  const { error, data: sub } = useSWR(
    subName ? `/subs/${subName}` : null,
    fetcher
  );

  useEffect(() => {
    if (!sub || !user) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, []);

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;

    const file = event.target.files[0];
    console.log(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current!.name);

    try {
      await axios.post(`/subs/${sub.name}/upload`, formData, {
        headers: {
          "Context-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openFileInput = (type: string) => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  return (
    <>
      {sub && (
        <>
          <div>
            <input
              type="file"
              hidden={true}
              ref={fileInputRef}
              onChange={uploadImage}
            />
            {/* 배너 이미지 */}
            <div className="bg-gray-400">
              {sub.bannerUrl ? (
                <div
                  className="h-56"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => {
                    openFileInput("banner");
                  }}
                ></div>
              ) : (
                <div
                  className="h-20 bg-gray-400"
                  onClick={() => {
                    openFileInput("banner");
                  }}
                ></div>
              )}
            </div>
            {/* 커뮤니티 메타 데이터 */}
            <div className="h-20 bg-white">
              <div className="relative flex max-w-5xl px-5 mx-auto">
                <div className="absolute" style={{ top: -15 }}>
                  {sub.imageUrl && (
                    <Image
                      priority={true}
                      src={sub.imageUrl}
                      alt="커뮤니티 이미지"
                      width={70}
                      height={70}
                      className="rounded-full"
                      onClick={() => {
                        openFileInput("image");
                      }}
                    />
                  )}
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-400">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 포스트와 사이드 바 */}
          <div className="flex max-w-5xl px-4 pt-5 mx-auto"></div>
        </>
      )}
    </>
  );
};

export default SubPage;
