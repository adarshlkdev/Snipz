import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const emojis = ["😀", "😂", "😍", "🥺", "😎", "😭", "😡", "👍", "🙏", "🎉"];

const CreatePost = () => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "An error occurred");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setText((prevText) => prevText + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src={authUser?.profileImg || "/avatar-placeholder.png"}
            alt="User Avatar"
          />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="relative">
          <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
          {showEmojiPicker && (
            <div className="absolute bottom-10 left-0 bg-gray-100 border rounded shadow-lg p-2">
              <div className="flex flex-wrap">
                {emojis.map((emoji) => (
                  <span
                    key={emoji}
                    className="cursor-pointer p-1"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
              alt="Selected"
            />
          </div>
        )}
        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
          </div>
          <input
            accept="image/*"
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? <LoadingSpinner  size="sm"/>: "Post"}
          </button> 
        </div>
        {isError && <p className="text-red-500">{error.message}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
