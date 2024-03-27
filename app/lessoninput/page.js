import React from "react";

export default function LessionInput() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div id='lessoninput' className="p-5 bg-gradient-to-b from-slate-300 via-gray-400 to-neutral-500 w-max rounded-xl">
                <form>

                    <div id="general" className="space-x-3">
                        <input type='text' id='fach' name='fach' placeholder="Fach" required className="w-24" />
                        <input type="text" id="klasse" name="klasse" placeholder="Klasse" required className="w-24"/>
                        <input type='text' id='room' name='room' placeholder="Zimmer" required className="w-24"/>
                        <select id='lektionsart' name='lektionsart' required className="w-48">
                            <option value='normal' selected>Normale Lektion</option>
                            <option value='pruefung'>Prüfung</option>
                            <option value='admin'>Administrativer Termin</option>
                        </select>
                    </div>

                    <div id="time" className="mt-3 space-x-3">
                        <label htmlFor="start">Von:</label>
                        <input
                        id='start'
                        type="time" 
                        required
                        min={"07:00"}
                        max={"22:00"}
                        step={900}
                        />
                        <label htmlFor="end">Bis:</label>
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
                    <div id='saveLessonInput' className="mt-6">
                        <input type='submit' value='Speichern' className="cursor-pointer" />
                    </div>
                </form>
            </div>
        </div>
    );
}