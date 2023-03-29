{1, 2} (unit) -> {
  a: {1} 1 -> {} ({2} 1 -> 2) -> [1, 2],
  b: {1} 1 -> {2} ({} 1 -> 2) -> [1, 2],
  c: {2} (1 -> 2) -> {} 1 -> [1, 2],
}

g: {1, 2} 2 -> 1
h: {} str -> bool

{}
[unknown, string]
x().a(5)(g)

{}
{} (unknown) -> [unknown, string]
x().a()

{}
{} (unknown) -> {} (unknown) -> [unknown, string]
x().a

{}
{
  a: {} (unknown) -> {} (unknown) -> [unknown, string]
}
x()

{}
(unknown) -> {
  a: {} (unknown) -> {} (unknown) -> [unknown, string]
}
x


tesat.t -> tesat['t']
