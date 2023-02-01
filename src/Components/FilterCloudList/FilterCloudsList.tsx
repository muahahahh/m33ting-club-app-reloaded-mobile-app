import React, { useState } from 'react'
import FilterCloud from '@/Components/FilterCloudList/FilterCloud'
import { FlatList } from 'react-native'
import { Flex } from 'native-base'

type FilterCloudsComponentProps = {
  onStatusChanged: (arg: Array<string>) => void
  statusesList: Array<string>
  defaultSelected: string
  multiSelect: boolean
  stretch: boolean
  buttonWidth?: number
  separatorWidth?: number
}

const FilterCloudsList: React.FC<FilterCloudsComponentProps> = ({
  onStatusChanged,
  statusesList,
  defaultSelected,
  multiSelect,
  stretch,
  buttonWidth,
  separatorWidth,
}) => {
  const [statuses, setStatuses] = useState<
    Array<{ text: string; selected: boolean }>
  >([
    ...statusesList.map(status => {
      return { text: status, selected: defaultSelected === status }
    }),
  ])

  const getCheckedStatuses = (
    allStatuses: Array<{ text: string; selected: boolean }>,
  ) => {
    return allStatuses
      .filter(item => {
        if (item.selected) {
          return item.text
        }
      })
      .map(({ text }) => text)
  }

  const statusSelectionHandler = (status: string) => {
    let statusesCopy = statuses.slice()

    statusesCopy.forEach((value, index) => {
      if (multiSelect) {
        if (value.text === status) {
          statusesCopy = [
            ...statusesCopy.slice(0, index),
            ...[{ text: value.text, selected: !value.selected }],
            ...statusesCopy.slice(index + 1),
          ]
        }
      } else {
        if (value.text === status) {
          statusesCopy = [
            ...statusesCopy.slice(0, index),
            ...[{ text: value.text, selected: true }],
            ...statusesCopy.slice(index + 1),
          ]
        } else {
          statusesCopy = [
            ...statusesCopy.slice(0, index),
            ...[{ text: value.text, selected: false }],
            ...statusesCopy.slice(index + 1),
          ]
        }
      }
      setStatuses(statusesCopy)
      onStatusChanged(getCheckedStatuses(statusesCopy))
    })
  }

  return (
    <FlatList
      horizontal={!stretch}
      numColumns={stretch ? statuses.length : 1}
      data={statuses}
      renderItem={({ item }) => (
        <FilterCloud
          width={buttonWidth}
          key={item.text}
          text={item.text}
          selectState={item.selected}
          onClick={() => {
            statusSelectionHandler(item.text)
          }}
          flex={stretch ? 1 : 0}
        />
      )}
      ItemSeparatorComponent={() => {
        return <Flex width={separatorWidth} />
      }}
    />
  )
}

export default FilterCloudsList
