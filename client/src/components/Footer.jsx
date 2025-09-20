import { assets } from "../assets/assets";

export default function Footer(){
    return(
        <div className="flex items-center justify-between gap-4 py-3 mt-20">
            <img src={assets.logo} width={150}/>
            <p className="flex-1 pl-4 text-sm mt-2 border-l text-gray-500 max-sm:hidden">Copyright @Ajitesh.dev | All right reserved.</p>

            <div className="flex gap-2.5">
                <img src={assets.facebook_icon} width={35} alt="Facebook"/>
                <img src={assets.twitter_icon} width={35} alt="Twitter"/>
                <img src={assets.instagram_icon} width={35} alt="Instagram"/>
            </div>
        </div>
    )
}