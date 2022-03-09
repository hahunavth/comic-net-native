import { View, Text } from 'native-base'
import { FindResultScreenProps } from '../../navigators/StackNav'
import { API_URL, resComicItem_T } from '../../types'
import axios from 'axios'
import { useApiFindComic } from '../../store/api'
import { ComicListVertical } from '../../components/ComicListVertical/ComicListVertical'
import { useColorModeStyle } from '../../hooks/useColorModeStyle'
import { Loading } from '../../components/Loading'
import React from 'react'
import { InteractionManager } from 'react-native'
import { selectDownloadedChapters } from '../../store/historySlice'
import { ListFooter } from '../../components/ComicListVertical/ListFooter'

/**
 * FIXME: INFINITY LIST UPDATE NEW PAGE SLOW
 */
export const FindResultScreen = (props: FindResultScreenProps) => {
  const { findOption, path } = props.route.params

  // const result = axios
  //   .get(
  //     `http://www.nettruyengo.com${path}`
  //     // {
  //     //   headers: { referer: 'http://www.nettruyenpro.com' }
  //     // }
  //   )
  //   // .then((res) => res.json())
  //   .then((data) => console.log(data.data))
  // console.log(`http://www.nettruyenpro.com${path}`)
  // const colorStyled = useColorModeStyle('', 'Secondary')

  const [page, setPage] = React.useState(1)
  const [seed, setSeed] = React.useState(0)
  const [max, setMax] = React.useState(1)
  const [list, setList] = React.useState<resComicItem_T[]>([])
  const [err, setErr] = React.useState<any>(null)
  const [refreshing, setRefreshing] = React.useState(false)

  const { isSuccess, isLoading, data, requestId, refetch } = useApiFindComic({
    ...findOption,
    page: page
  })
  // Interaction
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      // console.log('object')
      setLoading(false)
    })
    return () => {
      interaction.cancel()
    }
  })

  // Infinity list
  React.useEffect(() => {
    // console.log(Object.keys(data ||))
    setMax((max) =>
      typeof data?.pagination?.max === 'number' && data?.pagination?.max > 0
        ? data?.pagination?.max
        : max
    )
    if (
      isSuccess &&
      data?.data?.length &&
      page > seed &&
      data?.pagination?.page === page &&
      data?.pagination?.page <= max
    ) {
      setList((list) => [...list, ...data.data])
      setSeed(page)

      console.log(page, seed)
    }
  }, [isSuccess, isLoading, data])

  const onEndReach = React.useCallback(() => {
    console.log('reach', page, seed)
    if (page === seed) {
      console.log('reach active', page, seed)
      setPage(page + 1)
      refetch()
    }
  }, [setPage, seed, page])

  console.log('out', page, seed, max)

  return (
    <View flex={1}>
      {isLoading || loading ? (
        <Loading text="Fetching" />
      ) : (
        <>
          <ComicListVertical list={list || []} onEndReach={onEndReach} />
          <ListFooter page={seed} max={max} />
        </>
      )}
    </View>
  )
}