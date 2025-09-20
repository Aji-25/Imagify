import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";


export default function Header() {
    const {user, setShowLogin} = useContext(AppContext);
    const navigate = useNavigate();
    function handleClick(){
        if(user){
            navigate('/generate');
        }
        else{
            setShowLogin(true)
        }
    }
    return (
        <div className="flex flex-col justify-center items-center text-center my-20">
            <div className="text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500">
                <p>Best text to image generator</p>
                <img src={assets.star_icon} />
            </div>
            <h1 className="text-4xl max-w-[600px] sm:text-7xl sm:max-w-[590] mx-auto mt-10 text-center">Turn text to <span className="text-blue-600">image</span>, in seconds.</h1>
            <p className="text-center mx-auto max-w-xl mt-5">Unleash your creativity with AI. Turn your imagination into visual art in seconds - just type, and watch the magic happen.</p>
            <button onClick={handleClick} className="inline-flex items-center gap-2 px-12 py-3 rounded-full mt-10 bg-black text-white m-auto hover:scale-105 transition-all duration-500">
                Generate Images
                <img className='h-6'src={assets.star_group} />
            </button>

            <div className="flex gap-3 mt-16 flex-wrap justify-center">
                {Array(6).fill().map((item,index)=>(
                    <img className="rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10" 
                    src={index%2 ===0 ? assets.sample_img_2 : assets.sample_img_1}
                    key={index} width = {70}/>
                ))}
            </div>
            <p className="mt-2 text-neutral-600">Generated Images from Imagify</p>
        </div>

    )
} 