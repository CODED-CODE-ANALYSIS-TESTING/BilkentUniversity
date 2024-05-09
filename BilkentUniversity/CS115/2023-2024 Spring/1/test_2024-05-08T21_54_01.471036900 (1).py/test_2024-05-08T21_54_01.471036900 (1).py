import pytest
from io import StringIO
import sys
import temp

@pytest.mark.parametrize("input_str, expected_output", [
    ("Ali\nSu\nAyşe\n", "Enter first name: Enter second name: Enter third name: Ayşe 's name is the longest\n"),
    ("Berk\nCan\nDoğa\n", "Enter first name: Enter second name: Enter third name: Berk 's name is the longest, but there is a tie!\n"),
    ("Eren\nEce\nAli\n", "Enter first name: Enter second name: Enter third name: Eren 's name is the longest\n"),
    ("Ali\nEce\nNil\n", "Enter first name: Enter second name: Enter third name: Ali 's name is the longest, but there is a tie!\n")
])
def test_longest_name(input_str, expected_output, monkeypatch, capsys):
    monkeypatch.setattr("sys.stdin", StringIO(input_str))
    
    temp.main()
    
    captured = capsys.readouterr()
    assert captured.out == expected_output