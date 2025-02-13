import engine1Image from "../assets/img/ap-1.png";
import engine2Image from "../assets/img/bng-737.png";
import engine3Image from "../assets/img/cfm-56.png";
import engine4Image from "../assets/img/fj-44.png";

export interface Engine {
    id: number;
    title: string;
    description: string;
    engine_data: string;
    image_url: string;
}

export const mockEngines: Engine[] = [
    {
        id: 1,
        title: "AP-1",
        description: "Надёжный турбореактивный двигатель нового поколения для малых и средних авиалайнеров.",
        engine_data: "AP-1",
        image_url: engine1Image,
    },
    {
        id: 2,
        title: "BNG-737",
        description: "Энергоэффективный двигатель с высокой тягой, используемый в популярных пассажирских самолётах.",
        engine_data: "BNG-737",
        image_url: engine2Image,
    },
    {
        id: 3,
        title: "CFM-56",
        description: "Один из самых распространённых авиационных двигателей, отличающийся надёжностью и экономичностью.",
        engine_data: "CFM-56",
        image_url: engine3Image,
    },
    {
        id: 4,
        title: "FJ-44",
        description: "Компактный турбовентиляторный двигатель для бизнес-джетов и лёгких самолётов.",
        engine_data: "FJ-44",
        image_url: engine4Image,
    },
];
