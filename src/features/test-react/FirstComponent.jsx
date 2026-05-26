import { callHomeApi } from "../../api/HomeApiService";


export default function FirstComponent() {


    function callHelloWorldRestApi() {
        console.log("Button clicked");
        callHomeApi()
        .then((response) => handleApiResponsesuccess(response))
        .catch((error) => handleApiResponseError(error))
        .finally(() => console.log("API call completed"));
    }

    function handleApiResponsesuccess(response) {
        console.log("API response:", response);
    }

    function handleApiResponseError(error) {
        console.error("API error:", error);
    }

    return (
        <div className="first-component">
            <button className="btn btn-success" onClick={callHelloWorldRestApi}>
                Click me
            </button>
        </div>
    );
}

// FirstComponent.propTypes = {
//     title: PropTypes.string,
// };

// FirstComponent.defaultProps = {
//     title: "First Component",
// };