import { Box , FlatList, useToast } from "native-base";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { EmptyMyPoolList } from "./EmptyMyPoolList";
import { Game, GameProps } from "./Game";
import { Loading } from "./Loading";

interface GuessesProps {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: GuessesProps) {
  const [isSendGuess, setIsSendGuess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')
  const [games, setGames] = useState<GameProps[]>([])
  const toast = useToast()

  async function fetchGames() {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${poolId}/games`)
      setGames(response.data.games)
      console.log(response.data.games)

    } catch (error) {
      console.log(error)
      
      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        color: 'red.500'
      })

    } finally {
      setIsLoading(false)
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      setIsSendGuess(true)
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          color: 'red.500'
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      })

      toast.show({
        title: 'Palpite realizado com sucesso!',
        placement: 'top',
        color: 'green.500'
      })

    } catch (error) {
      console.log(error)
      
      toast.show({
        title: 'Não foi possível enviar o palpite',
        placement: 'top',
        color: 'red.500'
      })
    } finally {
      setIsSendGuess(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [poolId])

  if(isLoading) {
    return <Loading />
  }

  return (
    games.length > 0 &&
    <FlatList 
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => {handleGuessConfirm(item.id)}}
          isLoading={isSendGuess}
        />
        )}
        _contentContainerStyle={{ pb: 10 }}
        ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
