import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";


export default function OnlineCounter() {

  const [online, setOnline] = useState(0);


  useEffect(() => {

    const presenceKey = crypto.randomUUID();

    const channel = supabase.channel(
      "safar-online",
      {
        config: {
          presence: {
            key: presenceKey,
          },
        },
      }
    );


    function updateOnlineCount() {

      const state =
        channel.presenceState();


      const uniqueUsers =
        Object.keys(state).length;


      setOnline(uniqueUsers);

    }


    channel
      .on(
        "presence",
        { event: "sync" },
        () => {
          updateOnlineCount();
        }
      )

      .on(
        "presence",
        { event: "join" },
        () => {
          updateOnlineCount();
        }
      )

      .on(
        "presence",
        { event: "leave" },
        () => {
          updateOnlineCount();
        }
      )

      .subscribe(
        async (status) => {

          if (status !== "SUBSCRIBED") {
            return;
          }


          await channel.track({

            online_at:
              new Date().toISOString(),

            page:
              window.location.pathname,

          });


          updateOnlineCount();

        }
      );


    return () => {

      channel.untrack();

      supabase.removeChannel(
        channel
      );

    };

  }, []);


  return (

    <div className="online-counter">

      <span className="online-dot" />

      <span>
        {online} ONLINE
      </span>

    </div>

  );

}