import CourseCommunityHeader from "./CourseCommunityHeader";
import CourseTitleHeader from "./CourseTitleHeader";

export default function CourseMultiHeader({slice}) {
    return (
        <>
       <CourseCommunityHeader />
       <CourseTitleHeader slice={slice} />
       </>
    );
}