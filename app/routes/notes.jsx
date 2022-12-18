import { json, redirect } from "@remix-run/node"
import { Link, useCatch, useLoaderData } from "@remix-run/react"
import NewNote, { links as NewNoteLinks } from "~/components/NewNote"
import NoteList, { links as NoteListLinks } from "~/components/NoteList"
import { getStoredNotes, storeNotes } from "~/data/notes"

export function links() {
  return [...NewNoteLinks(), ...NoteListLinks()]
}

export default function NotesPage() {
  const notes = useLoaderData() // for access return data from loader

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  )
}

// * BACK END PROCESS
export async function action({ request }) {
  // * To get all data from form submit
  const formData = await request.formData()
  // const noteData = {
  //   title: formData.get("title"),
  //   content: formData.get("content"),
  // }
  // * convert formData into plain object javascript
  const noteData = Object.fromEntries(formData)

  if (noteData.title.trim().length < 5) {
    return {
      message: "invalid title - must be at least 5 characters long",
    }
  }

  // * add validation...
  const existingNotes = await getStoredNotes()
  noteData.id = new Date().toISOString()
  const updatedNotes = existingNotes.concat(noteData)
  await storeNotes(updatedNotes)

  await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000))

  return redirect("/notes")
}

export async function loader() {
  const notes = await getStoredNotes()
  if (!notes || notes.length === 0) {
    // * throw json will be return an error to CatchBoundary automatically
    throw json(
      { message: "could not find notes" },
      {
        status: 404,
      }
    )
  }

  // return new Response(
  //   JSON.stringify(notes),
  //   { headers: { 'Content-Type': 'application/json' } }
  // )
  return notes
}

// TO DISPLAY ERROR ONLY IN notes PAGES
export function CatchBoundary() {
  // * catch a error from throw json (remix)
  const coughtResponse = useCatch()
  const message = coughtResponse.data?.message || "Data not found"

  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  )
}

export function meta() {
  return {
    title: "all notes",
    description: "manage your notes with ease",
  }
}

// TO DISPLAY ERROR ONLY IN notes PAGES
export function ErrorBoundary({ error }) {
  return (
    <main className="error">
      <h1>An error in notes page!</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to="/">safety</Link>
      </p>
    </main>
  )
}
