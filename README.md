# AdventureScript

The idea is to build an adventure game from a config file, e.g.
```
// adventure.json
{
	scenes: [
		{
			id: 1,
			image: '/img/scenes/start.jpg',
			name: 'start',
			message: 'You find yourself in a room with a chest, and a key in your pocket.',
			clickables: [
				{
					image: '/img/clickables/chest.png',
					use: {
						id: 1,
						fail: 'There is a key hole in the front of the chest.'
					},
					acquire: 2,
					x: 100,
					y: 120
				},
				{
					image: '/img/scenes/start/clickables/door.png',
					x: 400,
					y: 220,
					scene: 2
				}
			]
		},
		{
			id: 2,
			image: '/img/scenes/outside.jpg',
			name: 'outside',
			clickables: [
				{
					image: '/img/scenes/outside/path_1.png',
					x: 100,
					y: 120,
					scene: 3
				},
				{
					image: '/img/scenes/outside/path_2.png',
					x: 500,
					y: 120,
					scene: 4
				}
			]
		}
	],
	items: [
		{
			id: 1,
			name: 'key',
			image: '/img/items/key.png
		},
		{
			id: 2,
			name: 'sword',
			image: '/img/items/sword.png,
			message: 'You open the chest to find a steel sword.'
		}
	]
}
