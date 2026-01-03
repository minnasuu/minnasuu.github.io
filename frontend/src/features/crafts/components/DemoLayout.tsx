import BackButton from "../../../shared/components/BackButton";

type Props = {
    title?:string;
    children: React.ReactNode;
}

export const DemoLayout: React.FC<Props> = ({
    title,
    children,
}) => <div>
    <div className="fixed w-fit top-0 left-0 h-18 flex justify-betweemen items-center px-6 z-100" style={{mixBlendMode:'difference'}}>
        <BackButton to="/crafts" theme="dark"/>
        <div className="font-bold ml-4" style={{fontSize:'1.25rem'}}>{title}</div>
    </div>
    <div className="w-screen h-screen flex flex-col items-center justify-center">{children}</div>
    </div>