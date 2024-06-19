import { toast } from "react-hot-toast";

export const loadCircles = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/svg");
    const json = await response.json();
    toast.success("¡Puntos cargados!");
    return json.svgs;
  } catch (error) {
    console.error("Error al cargar puntos:", error);
    throw error;
  }
};

export const updateCirclePosition = async (
  circleId: string,
  cx: number,
  cy: number,
  description: string,
  ip_address: string
) => {
  const updatePromise = fetch(`http://localhost:4000/api/svg/${circleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cx,
      cy,
      description,
      ip_address,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Error actualizando posición del punto");
    }
    return response.json();
  });

  toast.promise(updatePromise, {
    loading: "Actualizando posición...",
    success: "¡Actualización de posición exitosa!",
    error: "Error al actualizar la posición",
  });

  try {
    return await updatePromise;
  } catch (error) {
    console.error("Error al actualizar la posición:", error);
    throw error;
  }
};

export const createCircle = async (
  cx: number,
  cy: number,
  description: string,
  ip_address: string,
  r: number = 10,
  fill: string = "blue"
) => {
  try {
    const response = await fetch("http://localhost:4000/api/svg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "circle",
        cx,
        cy,
        r,
        fill,
        description,
        ip_address,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al agregar punto:", error);
    throw error;
  }
};

export const updateCircleDetails = async (
  circleId: string,
  cx: number,
  cy: number,
  description: string,
  ip_address: string
) => {
  const updatePromise = fetch(`http://localhost:4000/api/svg/${circleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cx,
      cy,
      description,
      ip_address,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Error actualizando detalles del punto");
    }
    return response.json();
  });

  toast.promise(updatePromise, {
    loading: "Actualizando detalles...",
    success: "¡Actualización de detalles exitosa!",
    error: "Error al actualizar detalles",
  });
};

export const deleteCircle = async (circleId: string) => {
  try {
    const response = await fetch(`http://localhost:4000/api/svg/${circleId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Fallo al eliminar punto con el id: ${circleId}`);
    }
    toast.success("Punto eliminado exitosamente");
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar punto:", error);
    throw error;
  }
};
