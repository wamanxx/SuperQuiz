import useSWR from "swr";
import { View, Text, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabase";

interface Props {
    incidentId: number;
    type: number;
}

const VoteRender = ({ incidentId, type }: Props) => {
    const { data, isLoading, error } = useSWR(`incidents/${incidentId}/votes`, async () => {
        const response = await supabase.from("incidents_vote").select("*").eq("incident_id", incidentId)

        if (response.error)
            throw response.error;
        return response.data;
    })


    if (isLoading) {
        return (
            <ActivityIndicator
            color={'black'}
            />)
    }

    if (error || !data) {
        return (
            <View>
                <Text>Erreur de chargement</Text>
            </View>)

    }
console.log(incidentId, data)
    const raw_votes = data;
    const result = {
        up: 0,
        down: 0,
    }
    
    raw_votes.forEach((vote) => {
        switch (vote.vote) {
            case 1:
                result.up += 1;
                break;
            case -1:
                result.down += 1;
                break;

            default:
                break;
        }
    })

    
    return type == 1?
    (
        <Text style={{fontFamily:'mon-sb'}}>{result.up}</Text>
    )
    :
    (
        <Text style={{fontFamily:'mon-sb'}}>{result.down}</Text>
    )
}

export default VoteRender