from build_presentation import build


def main() -> None:
    path = build()
    print(f"Presentation saved to: {path}")


if __name__ == "__main__":
    main()
