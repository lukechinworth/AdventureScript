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
					id: 1,
					x: 100,
					y: 120
				}
			]
		}
	],
	clickables: [
		{
			id: 1,
			name: 'chest',
			image: '/img/clickables/chest.png',
			use: {
				id: 1,
				fail: 'There is a key hole in the front of the chest.'
			},
			acquire: 2
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
