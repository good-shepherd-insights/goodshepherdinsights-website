import {Box, Flex, Stack, Text} from '@sanity/ui'
import type {StringInputProps} from 'sanity'

export function characterCount(max: number, target?: string) {
  function CharacterCountInput(props: StringInputProps) {
    const count = typeof props.value === 'string' ? [...props.value].length : 0
    const isOver = count > max
    const label = target
      ? `${count}/${max} characters, target ${target}`
      : `${count}/${max} characters`

    return (
      <Stack space={2}>
        {props.renderDefault(props)}
        <Flex justify="flex-end">
          <Box style={{color: isOver ? 'var(--card-critical-fg-color)' : undefined}}>
            <Text size={1} muted={!isOver}>
              {label}
            </Text>
          </Box>
        </Flex>
      </Stack>
    )
  }

  return CharacterCountInput
}
