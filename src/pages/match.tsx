import * as React from "react";
import useSWR from "swr";

export type MatchPageProps = {
  matchId?: string;
};

//-- exactMatchId - Id to a group of records that are the same material. Exact will specify how close (quarry / manufacturer / bundle).
//-- Table has a record of attributes (Material / Name / Listing / Size / Color A - X / Quarry / Seller / Bundle)

async function getMatch() {}

const MatchPage: React.FC<MatchPageProps> = (props) => {
  const { data } = useSWR(`Match_${props.matchId}`, async () => {
    if (!props.matchId) return null;

    return await getMatch();
  });

  return (
    <div>
      <h1>Hello MatchPage</h1>
    </div>
  );
};

export default MatchPage;
