export const loadCircles = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/svg");
    const json = await response.json();
    return json.svgs;
  } catch (error) {
    console.error("Error loading circles:", error);
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
  try {
    const response = await fetch(`http://localhost:4000/api/svg/${circleId}`, {
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
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating circle position:", error);
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
    console.error("Error adding circle:", error);
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
  try {
    const response = await fetch(`http://localhost:4000/api/svg/${circleId}`, {
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
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating circle details:", error);
    throw error;
  }
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
      throw new Error(`Failed to delete circle with id: ${circleId}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting circle:", error);
    throw error;
  }
};
