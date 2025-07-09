import { useParams } from "react-router";
import { useModel } from "../generic/model-store";

export default function CourseTitleHeader({slice}) {
    const { courseId: courseIdFromUrl, targetUserId } = useParams();

    const {
        title,
    } = useModel(slice, courseIdFromUrl);
    return (
        <div className="container-fluid main-course-header">
            <h1 className="h2" data-course-id={courseIdFromUrl}>
                {title}
            </h1>
        </div>
    );
}