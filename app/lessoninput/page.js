import React from "react";

export default function LessionInput() {
    return (
        <div className="flex items-center justify-center text-center bg-blue-200/50 min-h-screen">
            <div className="max-w-md w-full space-y-2">
                <h1 className="text-3xl font-extrabold text-sky-300">Lektion erfassen</h1>
                
                <div id='lessoninput' className="flex flex-col justify-center items-center">
                    <form>
                        <div id="general" className="space-x-3">
                            <input type='text' id='fach' name='fach' placeholder="Fach" required className="w-24" />
                            <input type="text" id="klasse" name="klasse" placeholder="Klasse" required className="w-24"/>
                            <input type='text' id='room' name='room' placeholder="Zimmer" required className="w-24"/>
                            <select id='lektionsart' name='lektionsart' required className="w-48">
                                <option value='normal' selected>Normale Lektion</option>
                                <option value='pruefung'>Prüfung</option>
                                <option value='frei'>Frei</option>
                            </select>
                        </div>

                        <div id="time" className="mt-3 space-x-3">
                            <label htmlFor="start" className="text-sky-500">Von:</label>
                            <input
                            id='start'
                            type="time"
                            required
                            min={"07:00"}
                            max={"22:00"}
                            step={900}
                            />
                            <label htmlFor="end" className="text-sky-500">Bis:</label>
                            <input
                            id='end'
                            type="time"
                            required
                            min={"07:00"}
                            max={"22:00"}
                            step={900}
                            />               
                            <input type='date' id='date' name='date' required />
                            <textarea id='homework' name='homework' placeholder="Hausaufgaben" className="resize"/>
                        </div>

                        <div id="goals" className="mt-8">
                            <textarea id='goals' name="goals" placeholder="Lernziele der Lektion"></textarea>
                        </div>

                        <div id='teacherNotes' className="mt-6">
                            <textarea id='teacherNotes' name='teacherNotes' placeholder="Ihre Notizen" />
                        </div>

                        <div id='studentNotes' className="mt-6">
                            <textarea id='studentNotes' name='studentNotes' placeholder="Notizen für SuS ඞ" />
                        </div>

                        <div id='files' className="mt-6">
                            <input type='file' name='files' />
                        </div>

                        <div id='saveLessonInput' className="mt-6">
                            <input type='submit' value='Speichern' className=" hover:bg-green-700" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}