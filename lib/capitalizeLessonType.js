/**
 * a function that capitalizes the first letter of a lesson type
 * because our api returns lesson types in lowercase
 * @param {*} lessonType 
 * @returns the lesson type with the first letter capitalized
 */
export function capitalizeLessonType(lessonType) {
    let firstChar = lessonType.charAt(0);
    let fullLessonType = firstChar.toUpperCase() + lessonType.slice(1);
    return fullLessonType
};