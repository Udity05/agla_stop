export const scenes = {
  earlyMorning: {
    key: "earlyMorning",

    image: "/early-morning.png",

    title: "अगला स्टॉप",

    subtitle: "NEXT STOP",

    playlistId: "PLMjKubj8ELu8",

    youtube:
      "https://music.youtube.com/playlist?list=PLMjKubj8ELu8&si=Q3W55eEg4y8-Bcvg",
  },

  morning: {
    key: "morning",

    image: "/morning.png",

    title: "अगला स्टॉप",

    subtitle: "NEXT STOP",

    playlistId: "PLMjKubj8ELu8",

    youtube:
      "https://music.youtube.com/playlist?list=PLMjKubj8ELu8&si=Q3W55eEg4y8-Bcvg",
  },

  afternoon: {
    key: "afternoon",

    image: "/afternoon.png",

    title: "अगला स्टॉप",

    subtitle: "NEXT STOP",

    playlistId: "PLMjKubj8ELu8",

    youtube:
      "https://music.youtube.com/playlist?list=PLMjKubj8ELu8&si=Q3W55eEg4y8-Bcvg",
  },

  night: {
    key: "night",

    image: "/night.png",

    title: "अगला स्टॉप",

    subtitle: "NEXT STOP",

    playlistId: "PLMjKubj8ELu8",

    youtube:
      "https://music.youtube.com/playlist?list=PLMjKubj8ELu8&si=Q3W55eEg4y8-Bcvg",
  },
};


export function getCurrentSceneKey(hour) {
  if (hour >= 5 && hour < 7) {
    return "earlyMorning";
  }

  if (hour >= 7 && hour < 12) {
    return "morning";
  }

  if (hour >= 12 && hour < 17) {
    return "afternoon";
  }

  return "night";
}