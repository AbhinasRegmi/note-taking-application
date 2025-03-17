import { ROUTES } from "@/constants/routes";
import { searchProps } from "@/providers/notes";

type searchNotesProps = {
  session: string;
} & searchProps;
type noteResponse = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  categories: string[];
};

export async function searchNotes(props: searchNotesProps) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/notes?take=${props.take}&page=${props.page}&orderBy=${props.orderBy}&sortOrder=${props.sortOrder}&search=${props.search ?? ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${props.session}`,
        },
      }
    );

    const body = await response.json();

    if (response.status == 200) {
      return body as noteResponse[];
    }

    if (response.status == 401) {
      throw "You are not authorized";
    }

    throw body.messsage ?? "Something went wrong";
  } catch (e) {
    throw e;
  }
}

export async function createNewNote(data: {
  title: string;
  content: string;
  categories: string[];
  session: string;
}) {
  try {
    const response = await fetch(`${ROUTES.backend.baseUrl}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.session}`,
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        categories: data.categories,
      }),
    });

    const body = await response.json();

    if (response.status === 201) {
      return {
        ok: true,
        data: body,
      };
    }

    if (response.status == 401) {
      throw "You do not access to create notes. Try again after login";
    }

    throw body.message ?? "Try again with different title";
  } catch (e) {
    if (typeof e == "string") {
      throw e;
    }

    throw "Something went wrong";
  }
}

interface updateNoteProps {
  title: string;
  content: string;
  categories: string[];
  id: string;
  session: string;
}

export async function updateNote(props: updateNoteProps) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/notes/${props.id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.session}`,
        },
        body: JSON.stringify({
          title: props.title,
          content: props.content,
          categories: props.categories,
        }),
      }
    );

    const body = await response.json();

    if (response.status == 200) {
      return {
        ok: true,
        message: "Your note has been updated.",
      };
    }

    if (response.status == 409) {
      throw "Please change the title.";
    }

    if (response.status == 401) {
      throw "You do not have access to update this note.";
    }

    throw body.message ?? "Try again later.";
  } catch (e) {
    throw e;
  }
}interface deleteNoteProps {
  id: string;
  session: string;
}
export async function deleteNote(props: deleteNoteProps) {
  try {
    const response = await fetch(
      `${ROUTES.backend.baseUrl}/notes/${props.id}`,
      {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.session}`,
        },
      }
    );

    const body = await response.json();

    if (response.status == 200) {
      return {
        ok: true,
        message: "Your note has been deleted.",
      };
    }

    if (response.status == 404) {
      throw "Cannot delete the note.";
    }

    if (response.status == 401) {
      throw "You do not have access to update this note.";
    }

    throw body.message ?? "Try again later.";
  } catch (e) {
    throw e;
  }
}

