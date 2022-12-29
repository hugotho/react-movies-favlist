import { useParams } from "react-router-dom";

export default function Details(props) {
    const id = useParams().id

    return (
        <div>
            <h2>Detalhes {id}</h2>
        </div>
    );
}