import Hero from "../components/Hero";
import Partners from "../components/Partners";
import WhyChooseUs from "./newPages/WhyChooseUs";
import UrbanFarmingIntro from "./newPages/UrbanFarmingIntro";
import HeroBanner from "./newPages/HeroBanner";
import WhyChooseUss from "./newPages/WhyChooseUss";
import CustomDesign from "./newPages/CustomDesign";

const Home = () => {
    return (
        <>
        <div className=" mx-auto  ">
            <Hero />
            <UrbanFarmingIntro />
            <WhyChooseUss/>
            <CustomDesign/>
            <WhyChooseUs />
            <HeroBanner/>
            <Partners />
        </div>
        </>
    );
};

export default Home;
